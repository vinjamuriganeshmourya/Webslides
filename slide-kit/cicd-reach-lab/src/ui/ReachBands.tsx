import { colors } from '@/design/tokens'
import { litBadge } from '@/ui/annotatedSurface'
import { FcNodeIn, useBeats } from '@/ui/figures/motion'
import { ApprovalMark } from './ApprovalMark'
import { ReachChain } from './ReachChain'
import { GrowDown, GrowRight } from './reachMotion'
import { CHAIN, REACH_PAINT, stopX, type CicdReachProps } from './cicdReach'

/**
 * REACH BANDS — the chain once, and three bands beneath it from a shared left
 * edge, each ending further right.
 *
 * THE ARGUMENT
 *
 * This is `ThreeLanes`' convention with `ThreeLanes`' cost removed. The stacked
 * rows of every published CI/CD diagram carry exactly two facts per row: where
 * the practice starts, and where it stops. Redrawing five stage cards per row to
 * carry two numbers is the expensive way to say it. A bar says it in 30px.
 *
 * SHARED LEFT EDGE IS THE WHOLE DEVICE. Three bars from one origin, each longer
 * than the last, is the plainest picture of containment there is: a viewer does
 * not compare two shapes, they compare two LENGTHS against a common datum, and
 * length against a datum is the one visual judgement people make accurately.
 * `NestedSpans` has the same datum but spends 92px per term reaching it;
 * `StopPoints` throws the datum away entirely and asks the viewer to supply it.
 *
 * THE OBJECTION, AND THE ANSWER
 *
 * A band is an abstraction ON TOP OF the chain, so a reader has to carry a
 * bar's right end back up to the stage above it. That lookup is the figure's one
 * real risk and it is why the LEADERS exist: a 2px line rises from each band's
 * right end to the underside of the chain, so the eye is taken to the boundary
 * rather than left to estimate it. If the lookup still reads as work when the
 * rendered figure is examined, `ThreeLanes` is the better figure and this one's
 * economy was bought at the wrong price.
 *
 * GEOMETRY
 *
 * A fixed 1080x276 stage, the shortest of the four by 116px.
 *
 *   chain      y 0..74
 *   ROW_PITCH  62   a 30px band carrying the term name in white on the accent,
 *                   4px, and one 16px consequence line. Rows at y = 96, 158,
 *                   220.
 *   leaders    from y=78 to each row's own top edge, at the band's right end.
 *              CI's is 18px long, Deployment's is 142px, and that difference is
 *              itself the nesting seen a second way.
 *   approval   at x=855, the boundary before stage 5, on Delivery's band. Its
 *              words are set to the RIGHT of the disc, in the 225px the band
 *              does not occupy, so they read as the next thing that happens
 *              rather than as a caption on the band.
 */

const BAND_H = 30
const ROW_PITCH = 62
const ROW_Y = (i: number) => 96 + i * ROW_PITCH
const H = ROW_Y(2) + BAND_H + 4 + 22

export function ReachBands({ stages, terms, className = '' }: CicdReachProps) {
  const shown = useBeats(1 + terms.length)

  return (
    <figure className={`relative mx-auto ${className}`} style={{ width: CHAIN.W, height: H }}>
      {/* The chain, neutral, on screen from beat 0. */}
      <div className="absolute" style={{ left: 0, top: 0 }}>
        <ReachChain stages={stages} tone={colors.ink} prefix="bands" />
      </div>

      {terms.map((term, i) => {
        const at = i + 1
        const on = shown[at]
        const paint = REACH_PAINT[term.tone]
        const x1 = stopX(term.reaches)
        const y = ROW_Y(i)
        return (
          <div key={term.name}>
            <GrowDown
              shown={on}
              className="absolute"
              style={{
                left: x1 - 2,
                top: CHAIN.CARD_H + 4,
                width: 2,
                height: y - (CHAIN.CARD_H + 4),
                background: paint,
                opacity: 0.55,
              }}
              delay={0.3}
            />
            <GrowRight
              shown={on}
              className="absolute flex items-center rounded-pill"
              style={{
                left: 0,
                top: y,
                width: x1,
                height: BAND_H,
                ...litBadge(paint),
              }}
            />
            {/*
              THE NAME IS NOT A CHILD OF THE BAND, AND THAT IS FORCED.

              The band animates `scaleX`, and a text child of a scaled box is
              stretched with it: the term name would arrive squashed to a sliver
              and widen out, which is a figure with a rendering bug rather than a
              figure with an entrance. So the label is a sibling, absolutely
              positioned over the band's left end, and it fades in on the same
              beat once the band has extended.
            */}
            <FcNodeIn
              at={at}
              shown={on}
              className="absolute"
              style={{ left: 14, top: y + 5 }}
            >
              <span
                className="font-heading font-bold"
                style={{ fontSize: 17, lineHeight: 1.15, color: colors.white }}
              >
                {term.name}
              </span>
            </FcNodeIn>
            <FcNodeIn
              at={at}
              shown={on}
              className="absolute"
              style={{ left: 2, top: y + BAND_H + 4 }}
            >
              <span style={{ fontSize: 16, lineHeight: 1.35, color: colors.body }}>
                {term.then}
              </span>
            </FcNodeIn>
            {term.approval && (
              <ApprovalMark
                x={x1}
                y={y + BAND_H / 2}
                height={BAND_H + 16}
                tone={paint}
                labelSide="right"
                shown={on}
              />
            )}
          </div>
        )
      })}
    </figure>
  )
}
