import type { ReactNode } from 'react'
import type { IconName } from '@/ui/icons'

/**
 * ONE CONTRACT FOR EVERY FEATURES FIGURE.
 *
 * Same principle as `flowchartFigure.ts` in the flow-chart lab: it describes
 * **meaning** and never geometry, because turning meaning into geometry is the
 * only thing the variants disagree about. Picking a winner is a rename at the
 * call site.
 *
 * WHY THIS LAB EXISTS
 *
 * "Here are the things it can do" is one of the commonest slides there is, and
 * the kit's answer to it is `CardGrid`: n cards of identical size, identical
 * white, identical tone, each with an icon and two lines. The user's verdict on
 * exactly that slide in the first Python session was *"All cards having same
 * design, it is not visually appealing"*, and then, more usefully, *"Instead of
 * cards you can use a different design altogether. Why should we be constrained
 * to cards?"* That is now section 8 of `STYLE_GUIDE.md`.
 *
 * Established practice says the same thing from the other end: a modular grid
 * whose cards are all one size defeats the point of a modular grid, because
 * nothing leads and the eye is given no anchor to enter on.
 *
 * So this contract carries the two things a flat card grid throws away.
 *
 * `weight` LETS ONE FEATURE LEAD
 *
 * A features slide almost always has a headline capability and some supporting
 * ones, and a grid of equals asserts that it does not. `hero` says which one
 * leads; a variant is free to draw that as a bigger tile, a first row, or a
 * brighter one, and that choice is the variant.
 *
 * `outcome` SEPARATES WHAT IT IS FROM WHAT IT BUYS
 *
 * "AI deal scoring" is a feature. "Cut your sales cycle by 30 percent" is what it
 * buys. A good features slide gives the room both, and the strongest layouts
 * alternate them rather than burying the outcome inside the description. Keeping
 * them as separate fields means a variant can put them in different places, or
 * drop one, without the caller rewriting its copy.
 */

export interface FeatureItem {
  id: string
  /** The capability, named. Two or three words, not a sentence. */
  label: string
  /** What it IS. One line. */
  body?: ReactNode
  /**
   * What it BUYS the person. One line, and phrased as their gain rather than the
   * product's behaviour: "You stop losing work", not "Autosaves continuously".
   */
  outcome?: ReactNode
  icon?: IconName
  /**
   * A technology mark from the central asset library, `/assets/tech/*.png`.
   * Hard rule 12: a technology named on a slide carries its logo.
   */
  logo?: string
  /**
   * The longer aside, revealed when the presenter hovers this feature.
   *
   * A SECOND LAYER, NOT AN OVERFLOW BIN. The room is watching a projector and
   * cannot hover anything, so `label`, `body` and `outcome` carry the teaching
   * and this carries what the instructor reaches for when somebody asks.
   */
  detail?: ReactNode
  /**
   * `hero` is the capability the slide is really about. **At most one**, and
   * `resolveFeatures` reports it rather than letting a variant pick silently.
   *
   * Everything with no weight is `normal`. A slide where every feature is a hero
   * has no hero.
   */
  weight?: 'hero' | 'normal'
}

export interface FeaturesFigureProps {
  items: FeatureItem[]
  /** One line under the whole figure, for the claim the set of features makes. */
  caption?: ReactNode
  className?: string
}

export interface ResolvedFeatures {
  hero?: FeatureItem
  /** Everything that is not the hero, in authored order. */
  rest: FeatureItem[]
  /** All items in authored order, hero included. */
  all: FeatureItem[]
  /** Contract violations, surfaced rather than drawn silently. */
  problems: string[]
}

/**
 * Resolve the set once, so six variants disagree about geometry only.
 *
 * The count checks are established practice rather than taste: past about six
 * tiles on one surface the arrangement stops being scannable and becomes a list
 * with borders, and this is a 1280x720 slide rather than a page someone can
 * scroll. Under three, a "grid" is three things in a row and the form is
 * pretending to structure that is not there.
 */
export function resolveFeatures({ items }: Pick<FeaturesFigureProps, 'items'>): ResolvedFeatures {
  const problems: string[] = []
  const heroes = items.filter((i) => i.weight === 'hero')

  if (heroes.length > 1) {
    problems.push(`${heroes.length} items marked hero; at most one leads`)
  }
  if (items.length > 6) {
    problems.push(`${items.length} features on one slide; past six it is a list, not a set`)
  }
  if (items.length < 3) {
    problems.push(`${items.length} features; under three needs no figure at all`)
  }
  for (const i of items) {
    if (!i.body && !i.outcome) problems.push(`feature "${i.id}" has neither body nor outcome`)
  }

  const hero = heroes[0]
  return {
    hero,
    rest: items.filter((i) => i !== hero),
    all: items,
    problems,
  }
}
