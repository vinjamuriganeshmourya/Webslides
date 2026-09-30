import type { CSSProperties, ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { iconByName } from '@/ui/icons'
import type { ComparisonTone } from './comparisonFigure'

/**
 * ONE TONE RAMP, ONE SIDE HEAD, ONE ATTRIBUTE LABEL, ONE CELL, FOR EVERY VARIANT
 * IN THIS LAB.
 *
 * The sibling labs each grew private copies of their card chrome and the padding
 * had drifted by the second variant. Two figures that differ in GEOMETRY must not
 * also differ in how much air is inside a box or which grey a cell is set in, or
 * the comparison measures the drift instead of the design.
 *
 * THE TONE RAMP, AND WHY IT IS NOT `definitions-lab`'s
 *
 * Next door the question is whether the room is meeting a word for the first
 * time, so the ramp is `neutral` / `new` / `contrast`. Here the two sides exist
 * to be told APART, so the ramp is about opposition:
 *
 *   `neutral`   an ordinary side. Brand blue.
 *   `contrast`  the other one. Teal, the style guide's secondary, so the pair
 *               reads as two things rather than as two weights of one thing.
 *   `lead`      the side the frame argues for. Deepest brand blue. Opt-in only,
 *               and `resolveComparison` refuses both sides carrying it.
 *
 * NO `good` AND NO `risk`, WHICH IS THE WHOLE DIFFERENCE FROM `proscons-lab`
 *
 * Every reference source on comparison slides reaches for green and red. That is
 * right for a pros-and-cons figure, where the two columns ARE valenced, and it is
 * wrong here: `docker run` is not the bad one, and painting it red teaches that
 * it is. A comparison says these are different; a verdict is a different figure
 * with a different contract.
 *
 * NO HOVER, ANYWHERE
 *
 * Same standing rule as next door. A deck is projected into a room where nobody
 * has a pointer, so content reachable only by hovering is content the people the
 * slide was made for never see. Every cell carries what it has to say on its
 * face, and the rest goes in the speaker notes.
 */

export const TONE_PAINT: Record<ComparisonTone, string> = {
  neutral: colors.brand,
  contrast: colors.teal,
  lead: colors.brandDark,
}

export const toneOf = (tone: ComparisonTone | undefined) => TONE_PAINT[tone ?? 'neutral']

/**
 * THE SURFACE, DECLARED ONCE.
 *
 * Solid white on one hairline, one accent edge, one soft neutral shadow. Lifted
 * wholesale from `definitionChrome.cardSurface`, deliberately unchanged, so a
 * slide carrying a definition card and a comparison reads as one system.
 *
 * The accent sits on the TOP edge here rather than the left, which is the one
 * change and it is structural: in this lab the accent belongs to a COLUMN, and a
 * left edge on a column reads as a divider between the two sides rather than as
 * a property of one of them.
 */
export function panelSurface(
  paint: string,
  accent: 'top' | 'left' | 'none' = 'top',
): CSSProperties {
  return {
    background: colors.white,
    border: `1px solid ${colors.line}`,
    ...(accent === 'top' ? { borderTop: `4px solid ${paint}` } : null),
    ...(accent === 'left' ? { borderLeft: `4px solid ${paint}` } : null),
    boxShadow: `0 10px 26px -18px ${colors.nwNavy}59`,
  }
}

/**
 * THE SIDE HEAD: the name of one of the two things.
 *
 * `ink`, not the tone's paint, for the reason `definitionChrome.Term` gives and
 * it is sharper here: two coloured headings say "these two are the important
 * part", which is true, and then say nothing about which is which, because both
 * have it. The tone lives on the accent edge and in the glyph, where it
 * distinguishes rather than decorates.
 *
 * `align` exists because `HeadToHead` mirrors its two panels and `AttributeSpine`
 * does not. It is the only thing a variant may change about a side head.
 */
export function SideHead({
  label,
  gloss,
  icon,
  paint,
  size = 'md',
  align = 'left',
}: {
  label: string
  gloss?: string
  icon?: string
  paint: string
  size?: 'sm' | 'md' | 'lg'
  align?: 'left' | 'center'
}) {
  const px = { sm: 18, md: 22, lg: 26 }[size]
  const Icon = icon ? iconByName[icon as keyof typeof iconByName] : undefined
  return (
    <span
      className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}
    >
      {Icon && (
        <span
          className="grid shrink-0 place-items-center rounded-xl2"
          style={{ width: 40, height: 40, background: `${paint}14`, color: paint }}
        >
          <Icon width={20} height={20} />
        </span>
      )}
      <span className="min-w-0">
        <span
          className="block font-heading font-bold"
          style={{
            color: colors.ink,
            fontSize: px,
            lineHeight: 1.16,
            letterSpacing: '-0.01em',
          }}
        >
          {label}
        </span>
        {gloss && (
          <span className="block text-body-sm font-semibold" style={{ color: paint }}>
            {gloss}
          </span>
        )}
      </span>
    </span>
  )
}

/**
 * THE ATTRIBUTE: the question a row asks of both sides.
 *
 * Uppercase, tracked, `muted`, and small. Every one of those is doing a job.
 *
 * It is deliberately the QUIETEST text in the figure, which is the opposite of
 * what it looks like it should be. The attribute is scaffolding: it tells the eye
 * what it is comparing and then gets out of the way, because the thing the room
 * is reading is the two answers. Set at cell weight it competed with them and the
 * row read as three equal columns, which is a table.
 *
 * Uppercase rather than sentence case because at this size and weight the
 * lowercase form was mistaken for a third cell. Uppercase is unambiguously a
 * label, and at four to five words it is still comfortable to read, which is why
 * `resolveComparison` caps the attribute at 32 characters.
 */
export function Attribute({
  children,
  align = 'center',
}: {
  children: ReactNode
  align?: 'center' | 'left'
}) {
  return (
    <span
      className={`block font-heading text-xs font-bold uppercase ${
        align === 'center' ? 'text-center' : ''
      }`}
      style={{ color: colors.muted, letterSpacing: '0.06em', lineHeight: 1.35 }}
    >
      {children}
    </span>
  )
}

/**
 * A CELL: one side's answer to one question.
 *
 * One size for the whole lab, so nothing competes. `emphasis` darkens to `ink`
 * for the pivot row and is the only variation allowed, because a cell that is
 * body grey here and ink there in the ordinary case is two components wearing one
 * name.
 */
export function Cell({
  children,
  emphasis = false,
  align = 'left',
}: {
  children: ReactNode
  emphasis?: boolean
  align?: 'left' | 'center'
}) {
  return (
    <span
      className={`block ${align === 'center' ? 'text-center' : ''}`}
      style={{
        color: emphasis ? colors.ink : colors.body,
        fontSize: 16.5,
        lineHeight: 1.55,
        fontWeight: emphasis ? 600 : 400,
      }}
    >
      {children}
    </span>
  )
}

/**
 * THE SEAM: the vertical rule between the two sides.
 *
 * A 1px hairline in `line`, and nothing else. It was a 2px tone-tinted rule for
 * one pass and the figure read as two documents side by side rather than as one
 * comparison: a heavy divider separates, and the whole argument of this lab is
 * that the two columns belong to the same rows.
 *
 * It is NEVER an arrow. An arrow between two options claims that one becomes the
 * other, which is a before/after figure and a different lab.
 */
export function Seam({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`block w-px self-stretch ${className}`}
      style={{ background: colors.line }}
    />
  )
}

/**
 * THE PIVOT MARK: a tinted band behind the one row that matters.
 *
 * A background wash rather than a border or a badge. A border adds a box to a
 * figure whose argument is that rows are not boxes, and a badge adds a word to a
 * row that already has three. A wash changes nothing structural and is visible
 * from the back of a room, which is the whole requirement.
 *
 * 8% of the lead paint. At 14%, the tint the glyph wells use, a full-width band
 * was louder than the two side heads above it.
 */
export function pivotWash(paint: string): CSSProperties {
  return { background: `${paint}14`, borderRadius: 12 }
}

/** The line under the set. One treatment, so a variant never invents its own. */
export function SetCaption({ children, width }: { children: ReactNode; width?: number }) {
  return (
    <p
      className="mt-3.5 text-center text-body-sm"
      style={{ color: colors.body, width, marginLeft: 'auto', marginRight: 'auto' }}
    >
      {children}
    </p>
  )
}

/**
 * Input this lab cannot draw, said out loud rather than drawn badly.
 *
 * Straight from the sibling labs, and it is the whole reason the resolver
 * exists: a figure that refuses is worth more than a figure that renders an
 * unreadable comparison and lets it ship.
 */
export function ProblemPanel({ problems, width }: { problems: string[]; width?: number }) {
  return (
    <figure className="mx-auto" style={{ width }}>
      <div className="rounded-card p-5" style={{ border: `2px solid ${colors.danger}` }}>
        <p
          className="mb-2 font-heading text-body-sm font-bold uppercase tracking-wide"
          style={{ color: colors.danger }}
        >
          this cannot be drawn as an A vs B comparison
        </p>
        <ul className="list-disc space-y-1 pl-5">
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
