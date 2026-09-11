import type { ReactNode } from 'react'
import type { BulletItem } from '@/ui/content'
import type { Tone } from '@/design/tokens'

/**
 * THE SHARED CONTRACT FOR EVERY CANDIDATE IN THIS LAB.
 *
 * All four candidates take these identical props, so swapping one for another in
 * a deck is a rename and nothing else. `comparison-lab`'s `compareFigure.ts` and
 * `flow-lab`'s `flowFigure.ts` established the pattern, and it is the thing that
 * makes choosing cheap: the gallery renders the same fixture four times and the
 * only variable between slides is the arrangement.
 *
 * WHAT THESE CANDIDATES ARE. Not figures. LAYOUTS — slide types, at the level of
 * `ContentSlide` and the four `Content*ImageSlide`s. The gap they fill is that
 * the kit has no slide type that places a LIVE FIGURE (`Terminal`, `DataTable`,
 * `BoundaryBridge`, `LayerStack`, `CodeBlock`) beside content:
 *
 *   - `ContentImageSlideProps` demands `media: SlideMedia`, which is a URL or a
 *     named illustration, and wraps it in `MediaFrame`'s image card. A `Terminal`
 *     is not media and does not want that card. Its `children` render in the TEXT
 *     column, not in the figure column, so passing a figure as `children` to
 *     `ContentRightImageSlide` puts the figure on the wrong side of the slide.
 *   - `ContentSlide` takes `children` and stacks lead -> points -> children,
 *     handing the children whatever height is left and centring them in it. The
 *     figure's vertical position is therefore a by-product of how long the copy
 *     above it happens to be.
 *
 * WHAT THAT GAP COST, MEASURED. Deployment session 6 hand-rolls figure placement
 * with 23 wrappers of the form `<div className="mx-auto w-full max-w-[980px]">`
 * at FIVE arbitrary widths (980px x15, 860px x4, 760px x2, 880px, 1010px). Over a
 * 51-slide render sweep that produced vertical float on 10 slides (the figure in
 * the middle band with dead space above AND below) and a left-aligned figure with
 * an empty right half on 4.
 */

/**
 * THE ONE WIDTH TOKEN. Not five.
 *
 * Every figure in a deck lands in the same column and is capped at the same
 * width, whatever candidate is chosen and whatever the figure is. This is the
 * whole point of the lab: a deck author never writes a px width again, so no two
 * slides in a deck can put their figure at two different widths.
 *
 * 980px is not a new number. It is the width session 6 reached for 15 times out
 * of 23 by hand, which makes it the measured house width rather than a taste.
 * The other four widths in that deck are what a per-slide decision looks like
 * after 51 slides.
 */
export const FIGURE_MAX = 'max-w-[980px]'

/**
 * THE VERTICAL RULE: THE BLOCK IS CENTRED IN THE WELL, CLAMPED OFF THE VIDEO
 * RESERVE. One function, and the distinction it encodes is the whole subtlety of
 * this lab.
 *
 * TWO QUESTIONS THAT LOOK LIKE ONE. They are not, and conflating them is how
 * `ContentSlide` ends up with its defect:
 *
 *   1. WHERE THE BLOCK SITS IN THE WELL. Centred. The prose and the figure
 *      together are ONE object, and that object is centred vertically in the
 *      space under the lead.
 *   2. HOW THE FIGURE AND THE PROSE SIT RELATIVE TO EACH OTHER. Locked to a
 *      common top edge, always, at any copy length.
 *
 * `ContentSlide` answers the second question with `items-center`, which centres
 * each COLUMN independently, so the shorter column's position is a function of
 * the taller one's content: the figure's top edge drifts to wherever the copy
 * beside it happens to end. Measured at 139px of drift on the one candidate here
 * that keeps that behaviour on purpose, and at 75px on the first pass of the
 * others before this was fixed.
 *
 * So: CENTRE THE BLOCK, NEVER THE COLUMNS. `items-start` on the row keeps the two
 * columns locked; `justify-center` on the well centres the locked pair. Going
 * back to `items-center` on the row would reintroduce the exact defect the lab
 * exists to remove, and it would look almost right on this fixture, which is what
 * makes it dangerous.
 *
 * THE CLAMP, AND WHY THE PADDING *IS* THE CLAMP.
 *
 * x 913..1280, y 0..220 is held for the instructor video composited in later. The
 * well runs to x=1216, so a figure on the right of the well or spanning it
 * reaches into that rectangle, and `video-safe.mjs` fails the deck. Centring is
 * free to move a block UPWARD, so centring alone is unsafe: `CaptionRail` landed
 * at y=217 and failed by three pixels the first time it was allowed to place
 * itself.
 *
 * The clamp is not a conditional. Applied as padding-top on the flex container
 * that carries `justify-center`, it reduces the box the block may be centred
 * WITHIN, so the block's top edge cannot be above y=224 by construction:
 *
 *   well top          y=168 bare, y=217 with a lead (a `SlideLead` is one line
 *                     of 22px at 1.5 plus its own `mb-4`, so 49px)
 *   padding           224 - 168 = 56px bare, 224 - 217 = 7px with a lead
 *   centred within    what is left, so top = max(true centre, 224). Always.
 *
 * A short block therefore centres normally — a 154px `Terminal` under a lead
 * lands at y=363 against a true centre of y=359 — and a block tall enough that
 * centring would carry it into the reserve is pushed down to exactly y=224 and no
 * further. There is no branch to get wrong and no state where the guard is
 * skipped.
 *
 * THE RESIDUAL ASYMMETRY, STATED RATHER THAN HIDDEN. Because the padding is
 * inside the centred box, the block sits half the padding below the well's true
 * centre: 4px on a slide with a lead, 28px on one without. Every slide type in
 * this kit that carries a figure also carries a lead (session 6's own rule D
 * says so, for this same rectangle), so 4px is the number that matters and it is
 * below the threshold at which anything reads as off-centre.
 *
 * It is a function and not a constant so that a candidate cannot take the string
 * and forget the condition.
 */
const ANCHOR_FLOOR_Y = 224

/** Applied to the flex container that centres the block. See above. */
export function figureClamp(lead: ReactNode | undefined): string {
  return lead ? 'pt-[7px]' : 'pt-[56px]'
}

/** Exported for the harnesses and for anyone checking the arithmetic above. */
export const CLAMP_FLOOR_Y = ANCHOR_FLOOR_Y

export interface FigureSideProps {
  /** The concept. Drawn at the slide's own top-left datum, never inside a column. */
  kicker?: string
  /** The sub-concept. Same datum. `align-check.mjs` measures every block against its left edge. */
  title: ReactNode
  /** The sentence the slide makes its argument with. Also the video guard's trigger. */
  lead?: ReactNode
  /** The prose beside, or beneath, the figure. */
  points?: (BulletItem | string)[]
  /**
   * The LIVE figure: a `Terminal`, `DataTable`, `BoundaryBridge`, `LayerStack` or
   * `CodeBlock`. A `ReactNode` and not a `SlideMedia`, which is the difference
   * from `ContentImageSlideProps` and the reason this contract exists.
   *
   * It arrives UNWRAPPED and uncapped: the candidate owns the column, the width
   * cap and the vertical anchor. A figure that carries its own `mx-auto
   * max-w-[…]` is the defect this lab is replacing.
   */
  figure: ReactNode
  /** A short gloss under the figure, where one earns its place. */
  caption?: ReactNode
  tone?: Tone
  lesson?: string
}
