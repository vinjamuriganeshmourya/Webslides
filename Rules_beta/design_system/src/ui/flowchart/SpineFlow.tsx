import { colors } from '@/design/tokens'
import { FcArrowDefs, FcEdgeDraw, FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import { resolveGraph, type FlowchartFigureProps } from './flowchartFigure'
import { NodeShell, lookOf, NODE_MIN_H } from './NodeShell'

/**
 * SPINE FLOW — the happy path is a straight line, and everything else hangs off it.
 *
 * THE ARGUMENT
 *
 * A process has one story and some exceptions. This draws the story as an
 * unbroken horizontal spine at full weight, and drops the exception below it in
 * amber, with the loop returning underneath. The room reads left to right once,
 * gets the whole process, and only then looks down at what happens when it
 * fails.
 *
 * That is the established guidance made literal: flow in ONE direction, and let
 * the dominant path be the visually dominant one. It is also the thing the kit's
 * `FlowChart` gets structurally wrong, because a flex row has no "below".
 *
 * WHY THE DECISION IS NOT A DIAMOND
 *
 * A rotated square makes its own text unreadable, so a diamond either carries
 * three words or carries them at an angle. This draws the decision as a chip
 * with the question set straight and a rule under it, and lets the two labelled
 * exits do the work the diamond's silhouette was doing. `CircuitMap` in this lab
 * keeps the real diamond, so the two can be compared rather than argued about.
 *
 * GEOMETRY
 *
 * A fixed 1100x360 stage. Five spine slots of 180px on 230px centres, so the
 * gaps are 50px and every edge has room for an arrowhead. The exception sits in
 * the gate's own column, 140px below, which is what keeps the "No" exit vertical
 * and therefore instantly legible as a departure from the line.
 */

const W = 1100
const SLOT = 180
const PITCH = 230
const SPINE_Y = 40
/* Sized from NodeShell's floor, not chosen: a two-line label plus an icon
   plus a caption needs 106px to show its declared 14px of padding. */
const NODE_H = NODE_MIN_H
const ALT_Y = 232

const cx = (i: number) => i * PITCH + SLOT / 2
const left = (i: number) => i * PITCH

const PAINT = {
  main: colors.brand,
  alt: colors.accentDark,
  end: colors.success,
}

export function SpineFlow({ nodes, edges, caption, className = '' }: FlowchartFigureProps) {
  const g = resolveGraph({ nodes, edges })
  const gateIdx = g.spine.findIndex((n) => n.kind === 'decision')
  const altNode = g.offSpine[0]
  const loopEdge = g.loop[0]
  const loopTargetIdx = loopEdge ? g.spineIndex(loopEdge.to) : -1

  const yMid = SPINE_Y + NODE_H / 2
  const altMid = ALT_Y + NODE_H / 2

  /*
    THE EXCEPTION STARTS AFTER THE HAPPY PATH FINISHES, NOT ALONGSIDE IT.

    The beats used to be `gateIdx * 2 + 2` for the "No" exit, which for a
    five-node spine is beat 6, and beat 6 is also when the node AFTER the
    decision lands. So the two branches left the fork at the same instant and the
    room had to watch both at once. The file's own choreography note said the
    happy path draws first and the exception second, and the arithmetic did not
    do it.

    `SPINE_END` is the last beat the spine occupies, and the exception starts on
    the beat straight after it, so the straight-through story is complete on
    screen before anything branches.

    No empty beat between them: these are CLICKS, and a click that changes
    nothing reads to the presenter as a figure that has stopped responding. The
    separation is the click itself.
  */
  const SPINE_END = (g.spine.length - 1) * 2
  const ALT_EDGE = SPINE_END + 1
  const ALT_NODE = SPINE_END + 2
  const LOOP = SPINE_END + 3
  const CAPTION = SPINE_END + 4
  const shown = useBeats(CAPTION + 1)

  return (
    <figure className={`relative mx-auto ${className}`} style={{ width: W, height: 372 }}>
      {/* CONNECTORS. One aria-hidden SVG layer under the DOM nodes: the lines are
          geometry, every label above is a real element, per content rule 17. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0"
        width={W}
        height={372}
        viewBox={`0 0 ${W} 372`}
      >
        <FcArrowDefs id="spine" colors={PAINT} />

        {/* The spine, segment by segment, each one landing after the node it
            leaves. Beat n is node n; beat n+1 is the edge out of it. */}
        {g.spine.slice(0, -1).map((_n, i) => (
          <FcEdgeDraw
            key={`s${i}`}
            d={`M ${left(i) + SLOT} ${yMid} H ${left(i + 1) - 6}`}
            at={i * 2 + 1} shown={shown[i * 2 + 1]}
            stroke={PAINT.main}
            markerEnd="url(#spine-main)"
          />
        ))}

        {/* The "No" exit: straight down out of the gate's own column, which is
            what makes it read as leaving the line rather than continuing it. */}
        {altNode && gateIdx >= 0 && (
          <FcEdgeDraw
            d={`M ${cx(gateIdx)} ${SPINE_Y + NODE_H} V ${ALT_Y - 6}`}
            at={ALT_EDGE} shown={shown[ALT_EDGE]}
            stroke={PAINT.alt}
            markerEnd="url(#spine-alt)"
          />
        )}

        {/* The loop home, dashed and last. Runs along the bottom and turns up
            into the step it returns to, so it never crosses the spine. */}
        {loopEdge && loopTargetIdx >= 0 && altNode && (
          <FcEdgeDraw
            d={`M ${left(gateIdx)} ${altMid} H ${cx(loopTargetIdx)} V ${SPINE_Y + NODE_H + 6}`}
            at={LOOP} shown={shown[LOOP]}
            stroke={PAINT.alt}
            dashed
            markerEnd="url(#spine-alt)"
          />
        )}
      </svg>

      {/* SPINE NODES */}
      {g.spine.map((n, i) => (
        <FcNodeIn
          key={n.id}
          at={i * 2} shown={shown[i * 2]}
          className="absolute"
          style={{ left: left(i), top: SPINE_Y, width: SLOT, height: NODE_H }}
        >
          <NodeShell
            node={n}
            look={lookOf(n)}
            paint={n.kind === 'end' ? PAINT.end : PAINT.main}
            side="top"
          />
        </FcNodeIn>
      ))}

      {/* THE EXCEPTION */}
      {altNode && (
        <FcNodeIn
          at={ALT_NODE} shown={shown[ALT_NODE]}
          className="absolute"
          style={{ left: left(gateIdx), top: ALT_Y, width: SLOT, height: NODE_H }}
        >
          <NodeShell node={altNode} look="step" paint={PAINT.alt} side="bottom" />
        </FcNodeIn>
      )}

      {/* EXIT LABELS. Absolutely positioned DOM, sitting on the line they name. */}
      {g.main
        .filter((e) => e.label && g.spineIndex(e.from) >= 0)
        .map((e) => {
          const i = g.spineIndex(e.from)
          return (
            <FcEdgeLabel
              key={`l${e.from}-${e.to}`}
              at={i * 2 + 1} shown={shown[i * 2 + 1]}
              className="absolute whitespace-nowrap rounded-pill px-2 py-0.5 text-[12px] font-bold uppercase tracking-wide"
              /*
                ABOVE THE CARD ROW, CENTRED ON THE GAP.
                These pills used to sit at `yMid - 32`, inside the card band, and
                start 4px past the card in a gap of `PITCH - SLOT` = 50px. Every
                label longer than about four characters was printed over by the
                next card: session 7's chain rendered GIT PU, WEBH, DOCK, DOCK.
                No label short enough to fit exists, so the fix is positional and
                not editorial. Above the row the only neighbours are the other
                edge labels, and those are `PITCH` = 230px apart.
                `whitespace-nowrap` because a pill that wraps is a pill that has
                grown a second line into the card it was lifted clear of.
              */
              style={{
                left: left(i) + SLOT + (PITCH - SLOT) / 2,
                top: SPINE_Y - 26,
                transform: 'translateX(-50%)',
                background: `${PAINT.main}1a`,
                color: PAINT.main,
              }}
            >
              {e.label}
            </FcEdgeLabel>
          )
        })}

      {g.alt
        .filter((e) => e.label)
        .map((e) => (
          <FcEdgeLabel
            key={`a${e.from}-${e.to}`}
            at={ALT_EDGE} shown={shown[ALT_EDGE]}
            className="absolute rounded-pill px-2 py-0.5 text-[12px] font-bold uppercase tracking-wide"
            style={{
              left: cx(gateIdx) + 10,
              top: SPINE_Y + NODE_H + 22,
              background: `${PAINT.alt}1a`,
              color: PAINT.alt,
            }}
          >
            {e.label}
          </FcEdgeLabel>
        ))}

      {loopEdge?.label && (
        <FcEdgeLabel
          at={LOOP} shown={shown[LOOP]}
          className="absolute rounded-pill bg-white px-2 py-0.5 text-[12px] font-semibold"
          style={{
            left: cx(loopTargetIdx) + 10,
            top: altMid - 12,
            color: PAINT.alt,
            border: `1px solid ${PAINT.alt}44`,
          }}
        >
          {loopEdge.label}
        </FcEdgeLabel>
      )}

      {caption && (
        <FcEdgeLabel
          at={CAPTION} shown={shown[CAPTION]}
          className="absolute text-center text-body-sm"
          style={{ left: 0, width: W, top: 350, color: colors.body }}
        >
          {caption}
        </FcEdgeLabel>
      )}
    </figure>
  )
}
