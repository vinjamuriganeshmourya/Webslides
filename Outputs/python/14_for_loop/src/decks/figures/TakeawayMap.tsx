/* What we did today, as the mechanism rather than a list.
 *
 * The reference draws the session's concepts as a tree of seven sentences, and
 * its own comment gives the reason a map beats bullets: every row carries a
 * chip with the concept's NAME on it, in its own colour, so a student looking
 * for `range` finds it in a second instead of reading five sentences to work
 * out which one is about range.
 *
 * THIS GOES ONE STEP FURTHER, with the user's go-ahead. A tree says what the
 * seven facts ARE; it does not say how they connect. The session taught one
 * causal chain -- a sequence is what you walk, the loop variable carries one
 * item of it per pass, and the sequence's length is therefore what decides how
 * many passes happen -- so the recap is drawn as that chain, left to right,
 * with the two things that catch people hanging off the stage each one is
 * actually about: `stop` under the sequence that produced it, `empty` under the
 * pass count it drives to zero.
 *
 * DOM, NOT SVG (content rule 17). Every box, chip and sentence is a real
 * element; the SVG layer behind carries ONLY connectors and arrowheads, which
 * have no labels. That is the line rule 17 draws.
 *
 * FIXED PIXEL LAYOUT, on purpose: the connectors have to meet the cards
 * exactly, so cards are placed by coordinate in a 1152x362 field -- 1152 is the
 * content width (x64 to x1216), 362 is what the well leaves once `ContentSlide`
 * has added its no-lead guard.
 */
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'
import { useInstant } from '@/motion/instant'
import { useClaimedSteps } from '@/motion/Stepper'

const W = 1152
const H = 362

/** The reference's chip palette, kept so the deck and the handout agree. */
const TINT = {
  forLoop: '#006DAF',
  string: '#1F9D62',
  range: '#8E44AD',
  ch: '#C77700',
  howMany: '#0B5FA5',
  warn: '#C7454E',
} as const

function Chip({ text, tint }: { text: string; tint: string }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-lg px-2.5 py-1 font-mono text-[13px] font-bold leading-none"
      style={{ background: tint, color: colors.white }}
    >
      {text}
    </span>
  )
}

function Node({
  at,
  shown,
  x,
  y,
  w,
  h,
  eyebrow,
  accent,
  children,
}: {
  at: number
  shown: boolean[]
  x: number
  y: number
  w: number
  h: number
  eyebrow?: string
  accent?: boolean
  children: ReactNode
}) {
  const instant = useInstant()
  return (
    <motion.div
      className="absolute flex flex-col justify-center gap-2 rounded-card px-4"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        border: `${accent ? 3 : 2}px solid ${accent ? colors.brand : colors.line}`,
        background: accent ? `${colors.brand}0F` : colors.white,
      }}
      initial={instant ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: at < 0 || shown[at] ? 1 : 0, y: at < 0 || shown[at] ? 0 : 10 }}
      transition={{ duration: T.enter, ease: c4(E.out) }}
    >
      {eyebrow && (
        <span
          className="font-heading text-[12px] font-bold uppercase tracking-[0.14em]"
          style={{ color: colors.muted }}
        >
          {eyebrow}
        </span>
      )}
      {children}
    </motion.div>
  )
}

/* Each connector appears with the card it points AT, so the chain builds in the
   direction the room reads it. */
const LINKS: { d: string; at: number; arrow?: boolean }[] = [
  { d: 'M576,56 L576,84 M176,84 L976,84 M176,84 L176,100', at: 0 },
  { d: 'M576,84 L576,100', at: 2 },
  { d: 'M976,84 L976,100', at: 2 },
  { d: 'M352,174 L392,174', at: 1, arrow: true },
  { d: 'M752,174 L792,174', at: 2, arrow: true },
  { d: 'M176,248 L176,284', at: 3 },
  { d: 'M976,248 L976,284', at: 4 },
]

export function TakeawayMap() {
  const instant = useInstant()
  /* FIVE STEPS, NOT SIX. The root is the claim the frame is making, not a
     reveal: a recap that opens blank tells the room nothing while the
     instructor finds the button. It is on from the first frame and the five
     presses build the chain under it. */
  const shown = useClaimedSteps(5)

  return (
    <div className="relative mx-auto" style={{ width: W, height: H }}>
      <svg className="pointer-events-none absolute inset-0" viewBox={`0 0 ${W} ${H}`} aria-hidden>
        <defs>
          <marker id="tm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={colors.brand} />
          </marker>
        </defs>
        {LINKS.map((l) => (
          <motion.path
            key={l.d}
            d={l.d}
            fill="none"
            stroke={colors.brand}
            strokeWidth={2.5}
            strokeLinecap="round"
            markerEnd={l.arrow ? 'url(#tm-arrow)' : undefined}
            initial={instant ? false : { opacity: 0 }}
            animate={{ opacity: shown[l.at] ? 0.6 : 0 }}
            transition={{ duration: T.label, ease: c4(E.out) }}
          />
        ))}
      </svg>

      {/* THE CLAIM THE WHOLE SESSION MAKES. Everything under it qualifies it. */}
      <Node at={-1} shown={shown} x={236} y={0} w={680} h={56} accent>
        <div className="flex items-center gap-3">
          <Chip text="for loop" tint={TINT.forLoop} />
          <span className="font-heading text-body-xl font-bold" style={{ color: colors.brandDark }}>
            walks a sequence, one item at a time
          </span>
        </div>
      </Node>

      {/* STAGE 1 -- what you walk. Both kinds the session met, together, because
          the loop cannot tell them apart and that is the point. */}
      <Node at={0} shown={shown} x={0} y={100} w={352} h={148} eyebrow="1 · the sequence">
        <div className="flex items-center gap-2.5">
          <Chip text="string" tint={TINT.string} />
          <span className="font-heading text-body-sm font-semibold" style={{ color: colors.ink }}>
            "Python" is 6 characters
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Chip text="range" tint={TINT.range} />
          <span className="font-heading text-body-sm font-semibold" style={{ color: colors.ink }}>
            range makes numbers
          </span>
        </div>
      </Node>

      {/* STAGE 2 -- what carries one item at a time. */}
      <Node at={1} shown={shown} x={400} y={100} w={352} h={148} eyebrow="2 · each pass">
        <div className="flex items-center gap-2.5">
          <Chip text="ch" tint={TINT.ch} />
          <span className="font-heading text-body-sm font-semibold" style={{ color: colors.ink }}>
            holds one item
          </span>
        </div>
        <span className="font-heading text-body-sm" style={{ color: colors.body }}>
          It changes every pass.
        </span>
      </Node>

      {/* STAGE 3 -- the consequence. This is the sentence the two stages before
          it exist to make obvious. */}
      <Node at={2} shown={shown} x={800} y={100} w={352} h={148} eyebrow="3 · how many">
        <div className="flex items-center gap-2.5">
          <Chip text="how many" tint={TINT.howMany} />
        </div>
        <span className="font-heading text-body-sm font-semibold" style={{ color: colors.ink }}>
          The sequence decides how many passes happen.
        </span>
      </Node>

      {/* The two that catch people, each under the stage it is actually about. */}
      <Node at={3} shown={shown} x={0} y={284} w={556} h={62}>
        <div className="flex items-center gap-3">
          <Chip text="stop" tint={TINT.warn} />
          <span className="font-heading text-body font-semibold" style={{ color: colors.ink }}>
            range(1, 5) gives 1 2 3 4, not 5
          </span>
        </div>
      </Node>

      <Node at={4} shown={shown} x={596} y={284} w={556} h={62}>
        <div className="flex items-center gap-3">
          <Chip text="empty" tint={TINT.warn} />
          <span className="font-heading text-body font-semibold" style={{ color: colors.ink }}>
            An empty sequence means zero passes
          </span>
        </div>
      </Node>
    </div>
  )
}
