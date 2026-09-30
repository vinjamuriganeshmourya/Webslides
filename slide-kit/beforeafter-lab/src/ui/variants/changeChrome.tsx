import type { CSSProperties, ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { iconByName } from '@/ui/icons'
import type { PhaseTone } from './changeFigure'

/**
 * ONE TONE RAMP, ONE PHASE HEAD, ONE DIMENSION LABEL, ONE CELL, ONE DELTA CHIP,
 * FOR EVERY VARIANT IN THIS LAB.
 *
 * The sibling labs each grew private copies of their card chrome and the padding
 * had drifted by the second variant. Two figures that differ in GEOMETRY must
 * not also differ in how much air is inside a box, or the comparison measures
 * the drift instead of the design.
 *
 * THE TONE RAMP IS ASYMMETRIC ON PURPOSE, AND THAT IS THE DIFFERENCE FROM
 * `comparison-lab`
 *
 * Next door the ramp is `neutral` / `contrast` / `lead`: two sides that exist to
 * be told apart, painted as equals unless the author opts in. Here the two sides
 * are the same subject at two times, and they are NOT equals:
 *
 *   `muted`  the before state. `body` text on a `surface` ground, no shadow, no
 *            accent. It is not being criticised. It is being left behind.
 *   `brand`  the after state. Ink on white, one accent edge, one soft shadow.
 *            It carries the weight because it is where the room is going.
 *   `risk`   the before state genuinely was broken. Requires `beforeWasBroken`,
 *            and the resolver refuses the paint without the claim.
 *
 * **The asymmetry is the argument.** Linia's survey of before-and-after layouts
 * notes that *"most layouts use equal column space"*, and equal treatment is
 * exactly what makes those slides read as "two states, pick one", which is a
 * comparison. The two panels here are the same WIDTH, because the content
 * deserves equal room, and deliberately not the same WEIGHT.
 *
 * NO GREEN AND NO RED BY DEFAULT. See the note at the top of `changeFigure.ts`:
 * in a lecture the before state is usually what the previous slide taught, and
 * painting it red says the last lesson was a mistake.
 *
 * NO HOVER, ANYWHERE. Standing rule: a deck is projected into a room where
 * nobody has a pointer.
 */

export const TONE_PAINT: Record<PhaseTone, string> = {
  muted: colors.muted,
  brand: colors.brand,
  risk: colors.danger,
}

export const toneOf = (tone: PhaseTone | undefined, fallback: PhaseTone = 'brand') =>
  TONE_PAINT[tone ?? fallback]

/**
 * THE BEFORE SURFACE: a flat tinted panel with no shadow and no accent.
 *
 * Flat is the whole point. Next to the after panel's white card it reads as the
 * thing that is already behind us, and it does that without a single word of
 * criticism, which is what `risk` red would have added.
 */
export function beforeSurface(broken: boolean): CSSProperties {
  return {
    background: colors.surface,
    border: `1px solid ${broken ? `${colors.danger}55` : colors.line}`,
    /*
      A 4px TOP BORDER IN THE HAIRLINE COLOUR, MATCHING THE ACCENT THE AFTER
      PANEL CARRIES.

      Not decoration and not an accent: it is there so the two panels are the
      same box. Without it the after panel's 4px accent made it 3px taller at the
      top, and the two phase heads sat 3px apart on a figure whose whole job is
      putting two states side by side. Visible in the render, invisible to all
      three harnesses, which measure boxes and have no opinion about two boxes
      that should agree.

      `colors.line` rather than transparent, so the before panel reads as closed
      on all four sides instead of open at the top.
    */
    borderTop: `4px solid ${broken ? `${colors.danger}55` : colors.line}`,
    borderRadius: 16,
  }
}

/**
 * THE AFTER SURFACE: white, one accent edge, one soft neutral shadow.
 *
 * Lifted from `comparisonChrome.panelSurface`, deliberately unchanged, so a
 * slide carrying a comparison and a before-and-after reads as one system.
 */
export function afterSurface(paint: string): CSSProperties {
  return {
    background: colors.white,
    border: `1px solid ${colors.line}`,
    borderTop: `4px solid ${paint}`,
    borderRadius: 16,
    boxShadow: `0 10px 26px -18px ${colors.nwNavy}59`,
  }
}

/**
 * THE PHASE HEAD: the name of one of the two states.
 *
 * `dim` sets the before state's label in `body` rather than `ink`. It is the one
 * place in the lab where the two states' type differs, and it is a small
 * difference on purpose: the before state has to read as present and finished,
 * not as disabled. Greying the label to `muted` was tried and the panel looked
 * switched off, which is a different claim from "this is what we used to do".
 */
export function PhaseHead({
  label,
  gloss,
  icon,
  paint,
  dim = false,
  size = 'md',
}: {
  label: string
  gloss?: string
  icon?: string
  paint: string
  dim?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const px = { sm: 18, md: 22, lg: 26 }[size]
  const Icon = icon ? iconByName[icon as keyof typeof iconByName] : undefined
  return (
    <span className="flex items-center gap-3">
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
            color: dim ? colors.body : colors.ink,
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
 * THE DIMENSION: what changed, as a label.
 *
 * Uppercase, tracked, `muted`, small. Same treatment and the same reasoning as
 * `comparison-lab`'s `Attribute`: it is scaffolding, it names what is being
 * shown and gets out of the way, and at cell weight the row reads as a third
 * column of content rather than as a label.
 *
 * Kept identical to the sibling deliberately. A deck that carries a comparison
 * on one slide and a before-and-after on the next should not be using two
 * different treatments for the same job.
 */
export function Dimension({ children }: { children: ReactNode }) {
  return (
    <span
      className="block font-heading text-xs font-bold uppercase"
      style={{ color: colors.muted, letterSpacing: '0.06em', lineHeight: 1.35 }}
    >
      {children}
    </span>
  )
}

/**
 * A CELL: one state's value for one dimension.
 *
 * `state` is the only variation, and it is not decoration: the before cell is
 * set in `body` and the after cell in `ink`, so a row read quickly still runs
 * light to dark, left to right. The arrow says the direction and the weight
 * agrees with it.
 */
export function Cell({
  children,
  state = 'after',
  size = 'md',
}: {
  children: ReactNode
  state?: 'before' | 'after'
  size?: 'sm' | 'md'
}) {
  const px = size === 'sm' ? 15 : 16.5
  return (
    <span
      className="block"
      style={{
        color: state === 'before' ? colors.body : colors.ink,
        fontSize: px,
        lineHeight: 1.55,
        fontWeight: state === 'after' ? 500 : 400,
      }}
    >
      {children}
    </span>
  )
}

/**
 * THE STATE NOTE: one line about the state as a whole.
 *
 * Set apart from the cells by being italic-free, smaller and in the tone, so it
 * does not read as one more dimension. It is the sentence that carries the
 * lesson, and on `StateArrow` it is the largest thing in the panel after the
 * label.
 */
export function StateNote({ children, paint }: { children: ReactNode; paint: string }) {
  return (
    <span className="block text-body-sm" style={{ color: paint, lineHeight: 1.5 }}>
      {children}
    </span>
  )
}

/**
 * THE DELTA CHIP: the arithmetic the two cells imply and neither states.
 *
 * A pill rather than plain text, because it is a different KIND of fact from the
 * cells either side of it: those are descriptions of a state, and this is a
 * measurement of the gap between them. Set in the mono face for the same reason
 * the sibling labs set an example in mono: it is a literal, and the face says so
 * before the value is read.
 *
 * `success` and not `brand`, and this is the one place in the lab where green
 * appears. It is honest here in a way it is not on the before panel: the delta
 * is the improvement, stated as a number the author had to have. Nothing else on
 * the figure is painted with a verdict.
 */
export function DeltaChip({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full px-2.5 py-1 font-mono"
      style={{
        background: `${colors.success}14`,
        color: colors.success,
        fontSize: 12.5,
        lineHeight: 1.3,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  )
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
 * unreadable change and lets it ship.
 */
export function ProblemPanel({ problems, width }: { problems: string[]; width?: number }) {
  return (
    <figure className="mx-auto" style={{ width }}>
      <div className="rounded-card p-5" style={{ border: `2px solid ${colors.danger}` }}>
        <p
          className="mb-2 font-heading text-body-sm font-bold uppercase tracking-wide"
          style={{ color: colors.danger }}
        >
          this cannot be drawn as a before and after
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
