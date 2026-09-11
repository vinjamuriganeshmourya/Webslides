import { colors } from '@/design/tokens'
import { litBadge, litRail } from '@/ui/annotatedSurface'
import { FcNodeIn, useBeats } from '@/ui/figures/motion'
import { ApprovalMark } from './ApprovalMark'
import { ReachChain } from './ReachChain'
import { GrowDown, GrowRight } from './reachMotion'
import { CHAIN, REACH_PAINT, estimateLines, stopX, type CicdReachProps } from './cicdReach'

/**
 * NESTED SPANS — three brackets above one chain, each reaching further right.
 *
 * THE ARGUMENT
 *
 * The content is containment, so draw containment. Each term is a bracket that
 * OPENS at the start of the pipeline and CLOSES where its automation stops, and
 * the three brackets are drawn one inside another: the outermost rail is
 * highest and widest, and every part of the term inside it, rail, arms, name
 * and consequence line, sits within its box. A viewer who never hears the word
 * "contains" still sees three boxes, each holding the one before it.
 *
 * That is the one thing three definition slides cannot do. A definition can
 * assert "continuous delivery includes continuous integration"; a bracket drawn
 * around another bracket is that sentence with nothing left to take on trust.
 *
 * GEOMETRY, stated the way `GateFlow` states its own.
 *
 * A fixed 1080x392 stage on `CHAIN`'s five 180px slots at 225px centres.
 *
 *   bands            NOT a fixed pitch. Each band is a 30px name badge
 *                     straddling its 3px rail, then its consequence line, and
 *                     the consequence line's height is `estimateLines` because
 *                     the innermost bracket is the NARROWEST box in the figure
 *                     and holds the LONGEST of the three lines. On this fixture
 *                     the rails land at y = 16, 82, 148 and the bands are 1, 1
 *                     and 3 lines tall. A fixed two-line pitch was the first
 *                     pass and it put Continuous Integration's third line on top
 *                     of the chain.
 *   LEFT_INSET   9px per level. All three brackets open at stage 1, so their
 *                     left arms would otherwise be one line at x=0 of three
 *                     different heights, which reads as one arm. Insetting each
 *                     inner bracket by 9px makes the left edges nest the way the
 *                     right edges already do. It is the one place the figure is
 *                     not exact: a left arm sits up to 18px right of the stage
 *                     it opens on, while every RIGHT arm lands flush on the
 *                     boundary it marks, because that is the end carrying the
 *                     claim.
 *   ARM_BOTTOM       6px clear of the chain, so an arm points at the boundary
 *                     rather than colliding with the card beside it.
 *   height           358px on this fixture, measured.
 *
 * WHY THE NAME BADGE SITS ON THE RAIL AND IS OPAQUE
 *
 * `comparison-lab` shipped a label at an 8% tint with a 2px rule running
 * straight through the words, and it read as struck through. A label that sits
 * ON a rule must mask it, so this is `litBadge`, which is solid.
 */

const BADGE_H = 30
const LINE_H = 22
const TEXT_GAP = 20
const BAND_GAP = 9
const LEFT_INSET = (k: number) => k * 9
const RAIL_TOP = 16

/**
 * The bands, laid out top down, outermost first, each as tall as its own text.
 *
 * Returned keyed by the term's index in the CONTRACT's order (innermost first),
 * so the render loop can stay in contract order while the canvas runs the other
 * way.
 */
function layout(terms: CicdReachProps['terms']) {
  const n = terms.length
  const railY: number[] = []
  const textH: number[] = []
  let y = RAIL_TOP
  for (let k = 0; k < n; k++) {
    const term = terms[n - 1 - k]
    const x0 = LEFT_INSET(k)
    const width = stopX(term.reaches) - x0 - 40
    const h = estimateLines(term.then, width) * LINE_H
    railY[n - 1 - k] = y
    textH[n - 1 - k] = h
    y += TEXT_GAP + h + BADGE_H / 2 + BAND_GAP
  }
  const armBottom = y - BADGE_H / 2 - BAND_GAP + 6
  const chainTop = armBottom + 6
  return {
    railY,
    textH,
    armBottom,
    chainTop,
    /* The approval mark's bar reaches 8px past the chain and its words take
       another 28px under that. */
    height: chainTop + CHAIN.CARD_H + 8 + 28,
  }
}

export function NestedSpans({ stages, terms, caption, className = '' }: CicdReachProps) {
  /* FOUR BEATS: the chain, then one term per click. Beat 0 is free, per
     `useBeats`, because a slide that opens on an empty stage looks like a figure
     that failed to render. */
  const shown = useBeats(1 + terms.length)
  const n = terms.length
  const L = layout(terms)

  return (
    <figure
      className={`relative mx-auto ${className}`}
      style={{ width: CHAIN.W, height: L.height }}
    >
      {terms.map((term, i) => {
        /* Innermost first in the contract, outermost first on the canvas. */
        const k = n - 1 - i
        const at = i + 1
        const on = shown[at]
        const paint = REACH_PAINT[term.tone]
        const x0 = LEFT_INSET(k)
        const x1 = stopX(term.reaches)
        const railY = L.railY[i]
        return (
          <div key={term.name}>
            <GrowRight
              shown={on}
              className="absolute rounded-pill"
              style={{ left: x0, top: railY, width: x1 - x0, height: 3, ...litRail(paint) }}
            />
            <GrowDown
              shown={on}
              className="absolute rounded-pill"
              style={{
                left: x0,
                top: railY,
                width: 3,
                height: L.armBottom - railY,
                ...litRail(paint),
              }}
              delay={0.22}
            />
            <GrowDown
              shown={on}
              className="absolute rounded-pill"
              style={{
                left: x1 - 3,
                top: railY,
                width: 3,
                height: L.armBottom - railY,
                ...litRail(paint),
              }}
              delay={0.34}
            />
            <FcNodeIn
              at={at}
              shown={on}
              className="absolute"
              style={{ right: CHAIN.W - x1, top: railY - BADGE_H / 2 }}
            >
              <div
                className="flex items-center rounded-pill px-4 font-heading font-bold"
                style={{ height: BADGE_H, fontSize: 17, lineHeight: 1, ...litBadge(paint) }}
              >
                {term.name}
              </div>
            </FcNodeIn>
            <FcNodeIn
              at={at}
              shown={on}
              className="absolute"
              style={{
                left: x0 + 24,
                top: railY + TEXT_GAP,
                width: x1 - x0 - 40,
                height: L.textH[i],
              }}
            >
              <div style={{ fontSize: 16, lineHeight: 1.4, color: colors.body }}>{term.then}</div>
            </FcNodeIn>
            {term.approval && (
              <ApprovalMark
                x={x1}
                y={L.chainTop + CHAIN.CARD_H / 2}
                height={CHAIN.CARD_H + 16}
                tone={paint}
                labelSide="below"
                shown={on}
              />
            )}
          </div>
        )
      })}

      {/* THE CHAIN, NEUTRAL THROUGHOUT. It is the thing all three terms are
          measured against, so it takes no term's colour: the moment the chain
          is painted in one term's accent it starts to look like that term's
          property rather than the shared fixture. */}
      <div className="absolute" style={{ left: 0, top: L.chainTop }}>
        <ReachChain stages={stages} tone={colors.ink} prefix="nested" />
      </div>

      {caption && (
        <div
          className="absolute text-center"
          style={{ left: 0, width: CHAIN.W, top: L.height - 20, fontSize: 16, color: colors.body }}
        >
          {caption}
        </div>
      )}
    </figure>
  )
}
