import { colors } from '@/design/tokens'
import { litCard, litRail } from '@/ui/annotatedSurface'
import { FcNodeIn, useBeats } from '@/ui/figures/motion'
import { ApprovalMark } from './ApprovalMark'
import { ReachChain } from './ReachChain'
import { GrowDown } from './reachMotion'
import { CHAIN, REACH_PAINT, estimateLines, stopX, type CicdReachProps } from './cicdReach'

/**
 * STOP POINTS — one chain, three markers planted where each term's automation
 * stops. The restrained answer, and the control in the experiment.
 *
 * THE ARGUMENT
 *
 * `NestedSpans` spends its whole vertical budget on brackets whose only job is
 * to say "from the beginning". But every one of these three terms starts at the
 * beginning, always, without exception, and a figure that redraws a constant
 * three times is spending ink on the part that carries no information. Drop the
 * spans and mark only what differs: WHERE each one stops.
 *
 * If that works, it is the better figure, because it is a third shorter and it
 * puts nothing between the reader and the chain. If it does not, the lab has
 * learned that containment is not something a viewer infers from three
 * fenceposts, and that is the finding worth having.
 *
 * GEOMETRY
 *
 * A fixed 1080x404 stage.
 *
 *   badge            a 17px name on 1.15, then the consequence line at 16px on
 *                    1.35, with 14px of the padding scale at either end. Its
 *                    height is `estimateLines` and not a constant: the term with
 *                    the LONGEST line, Continuous Integration, is also the one
 *                    whose badge is narrowest, because a badge is right-anchored
 *                    on its own boundary and Continuous Integration's boundary
 *                    is at x=405. On this fixture the three are 3, 2 and 2 lines
 *                    tall.
 *   TIER_GAP     8   three tiers, outermost highest. Tiers are forced and not
 *                    chosen: badges are up to 420px wide, so Delivery's
 *                    (435..855) and Deployment's (660..1080) overlap on x and
 *                    cannot share a row.
 *   height           385px on this fixture, measured.
 *   marker      a 4px bar from its badge's bottom edge, down THROUGH the chain
 *                    and 8px past it, so it reads as a fence planted across the
 *                    line rather than as a pointer aimed at it.
 *
 * WHY THE BADGE IS `litCard` AND NOT `litBadge`
 *
 * It carries two lines, one of which is the term's consequence, and 16px of
 * white type on a saturated ground is the hardest thing on the slide to read
 * from the back of a room. `annotatedSurface.ts` states the rule: amplitude
 * follows the job, and a surface holding dark text takes the gentler ramp.
 */

const BADGE_W = 520
const BADGE_PAD = 12
const NAME_H = 20
const LINE_H = 22
const TIER_GAP = 8

/** Tier tops and badge heights, outermost first, keyed by contract index. */
function layout(terms: CicdReachProps['terms']) {
  const n = terms.length
  const tierY: number[] = []
  const badgeH: number[] = []
  let y = 0
  for (let k = 0; k < n; k++) {
    const i = n - 1 - k
    const term = terms[i]
    const width = BADGE_W - BADGE_PAD * 2
    const h = BADGE_PAD * 2 + NAME_H + 3 + estimateLines(term.then, width) * LINE_H
    tierY[i] = y
    badgeH[i] = h
    y += h + TIER_GAP
  }
  const chainTop = y + 4
  return {
    tierY,
    badgeH,
    chainTop,
    markBottom: chainTop + CHAIN.CARD_H + 8,
    height: chainTop + CHAIN.CARD_H + 8 + 28,
  }
}

export function StopPoints({ stages, terms, caption, className = '' }: CicdReachProps) {
  const shown = useBeats(1 + terms.length)
  const L = layout(terms)

  return (
    <figure
      className={`relative mx-auto ${className}`}
      style={{ width: CHAIN.W, height: L.height }}
    >
      {terms.map((term, i) => {
        const at = i + 1
        const on = shown[at]
        const paint = REACH_PAINT[term.tone]
        const x = stopX(term.reaches)
        const tierY = L.tierY[i]
        const badgeH = L.badgeH[i]
        /*
          RIGHT-ANCHORED ON ITS OWN BOUNDARY, EXCEPT WHEN THAT WOULD GO
          OFF-FRAME.

          A badge whose right edge sits on the marker says "this term stops
          here" before a word is read, and that is the device. Continuous
          Integration's boundary is at x=405 and the badge is 520px wide, so
          right-anchoring it would start it at -115. It is therefore pinned to
          x=0 and overhangs its own marker to the right, with the marker still
          dropping out of the badge's underside.

          The first pass avoided the overhang by capping the badge at its own
          boundary instead, 405px wide. That forced Continuous Integration's
          consequence line onto THREE lines, which made the whole composite
          445px tall: its top edge centred to y=216, four pixels inside the
          instructor-video reserve at y 0..220, and `video-safe.mjs` failed. A
          clamped figure is not a centred figure, so the fix has to remove
          height rather than hide it, and 520px of badge is where the height
          went.
        */
        const left = Math.max(0, x - BADGE_W)
        const width = Math.min(BADGE_W, CHAIN.W - left)
        return (
          <div key={term.name}>
            <FcNodeIn
              at={at}
              shown={on}
              className="absolute"
              style={{ left, top: tierY, width, height: badgeH }}
            >
              <div
                className="flex h-full flex-col justify-center rounded-xl"
                style={{ padding: BADGE_PAD, ...litCard(paint) }}
              >
                <div
                  className="font-heading font-bold"
                  style={{ fontSize: 17, lineHeight: 1.15, color: colors.ink }}
                >
                  {term.name}
                </div>
                <div style={{ fontSize: 16, lineHeight: 1.35, color: colors.body, marginTop: 3 }}>
                  {term.then}
                </div>
              </div>
            </FcNodeIn>
            {/* THE MARKER. It grows downward out of the badge, so the badge is
                the cause and the fence is the consequence, in that order. */}
            <GrowDown
              shown={on}
              className="absolute rounded-pill"
              style={{
                left: x - 2,
                top: tierY + badgeH,
                width: 4,
                height: L.markBottom - (tierY + badgeH),
                ...litRail(paint),
              }}
              delay={0.18}
            />
            {term.approval && (
              <ApprovalMark
                x={x}
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

      <div className="absolute" style={{ left: 0, top: L.chainTop }}>
        <ReachChain stages={stages} tone={colors.ink} prefix="stops" />
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
